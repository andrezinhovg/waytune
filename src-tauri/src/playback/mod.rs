pub mod mpv;

use std::sync::Arc;
use tokio::sync::Mutex;

use crate::error::AppError;

/// Run a blocking MPV operation off the async runtime worker threads.
///
/// `MpvPlayer`'s spawn/stop calls are synchronous and can block for seconds —
/// `stop()` waits up to ~6s for the previous mpv process to exit. Running that
/// directly inside an async command holds a runtime worker hostage and, worse,
/// keeps the player lock held the whole time, so the 3s `is_playing` poll
/// (which takes the same lock) stacks up behind it. `spawn_blocking` +
/// `blocking_lock` moves the work to a dedicated blocking thread.
pub async fn with_player<F, T>(mpv: &Arc<Mutex<mpv::MpvPlayer>>, f: F) -> Result<T, AppError>
where
    F: FnOnce(&mut mpv::MpvPlayer) -> Result<T, AppError> + Send + 'static,
    T: Send + 'static,
{
    let mpv = mpv.clone();
    tokio::task::spawn_blocking(move || {
        let mut player = mpv.blocking_lock();
        f(&mut player)
    })
    .await
    .map_err(|e| AppError::Mpv(format!("mpv task panicked: {e}")))?
}

/// Check if MPV is installed on the system
pub fn check_mpv_installed() -> bool {
    mpv::MpvPlayer::check_installed()
}
