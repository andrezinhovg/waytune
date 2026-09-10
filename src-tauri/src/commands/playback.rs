use crate::db::{queries, mutations, models::Channel};
use crate::error::AppError;
use crate::playback;
use crate::state::{AppState, CurrentChannel};
use log::{info, warn};
use tauri::State;

#[tauri::command]
pub async fn check_mpv_installed() -> Result<bool, AppError> {
    // check_installed() spawns `mpv --version` and blocks on it
    tokio::task::spawn_blocking(playback::check_mpv_installed)
        .await
        .map_err(|e| AppError::Mpv(format!("mpv task panicked: {e}")))
}

#[tauri::command]
pub async fn play_channel(state: State<'_, AppState>, channel: Channel) -> Result<(), AppError> {
    let (audio_lang, subtitle_lang) = {
        let conn = state.pool.get()?;
        let settings = queries::get_multiple_settings(&conn, &["audio_language", "subtitle_language"])?;

        let audio = settings
            .get("audio_language")
            .filter(|s| !s.is_empty())
            .cloned();
        let subtitle = settings
            .get("subtitle_language")
            .filter(|s| !s.is_empty())
            .cloned();

        (audio, subtitle)
    };

    let name = channel.name.clone();
    let url = channel.url.clone();
    playback::with_player(&state.mpv_player, move |player| {
        player
            .play_with_title(&url, Some(&name), audio_lang.as_deref(), subtitle_lang.as_deref())
            .map_err(|e| AppError::Mpv(e.to_string()))
    })
    .await?;

    {
        let mut curr = state.current_channel.write().await;
        *curr = Some(CurrentChannel::from_channel(&channel));
    }

    if let Some(channel_id) = channel.id {
        let conn = state.pool.get()?;
        if let Err(e) =
            mutations::upsert_watch_progress(&conn, channel_id, &channel.content_type, None, None, None, None, None)
        {
            warn!("Failed to record watch progress: {}", e);
        }
    }

    info!("Playing channel: {} ({})", channel.name, channel.content_type);

    Ok(())
}

#[tauri::command]
pub async fn stop_playback(state: State<'_, AppState>) -> Result<(), AppError> {
    playback::with_player(&state.mpv_player, |player| {
        player.stop().map_err(|e| AppError::Mpv(e.to_string()))
    })
    .await?;

    {
        let mut curr = state.current_channel.write().await;
        *curr = None;
    }

    info!("Playback stopped");

    Ok(())
}

#[tauri::command]
pub async fn is_playing(state: State<'_, AppState>) -> Result<bool, AppError> {
    playback::with_player(&state.mpv_player, |player| Ok(player.is_playing())).await
}
