<div align="center">
  <img src="src/assets/logo/logo-256.png" alt="Waytune Logo" width="200"/>

  # Waytune

  **Player de IPTV moderno e multiplataforma, construído com Rust e Tauri**

  [![Test Build](https://github.com/andrezinhovg/waytune/workflows/Test%20Build/badge.svg)](https://github.com/andrezinhovg/waytune/actions)
  [![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-blue.svg)](#-instalação)
  [![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](LICENSE)

  [Funcionalidades](#-funcionalidades) • [Instalação](#-instalação) • [Primeiros Passos](#-primeiros-passos) • [FAQ](#-faq) • [Contribuindo](#-contribuindo)

  Read this in: [English](README.md) | **Português (Brasil)**
</div>

> **Nota:** Waytune não tem afiliação com nenhum provedor de IPTV. Os usuários são responsáveis por cumprir as leis locais e os termos do provedor.

---

## 📺 Visão Geral

Waytune é um player de IPTV para desktop que combina a performance do Rust com uma interface web moderna. Construído sobre o MPV para reprodução de vídeo, ele lida com TV ao vivo, filmes e séries no Linux, Windows e macOS.

**Por que Waytune?**
- **Rápido e Eficiente** - O backend em Rust lida com mais de 100.000 canais sem travar
- **Recursos Inteligentes** - EPG, controle parental, suporte a múltiplos perfis, e mais
- **Interface Moderna** - Interface limpa e responsiva, com temas claro/escuro
- **Privacidade em Primeiro Lugar** - Todos os dados ficam armazenados localmente, credenciais nunca saem do seu dispositivo
- **Multiplataforma** - Um único app para Linux, Windows e macOS

---

## ✨ Funcionalidades

### 🎬 Biblioteca de Conteúdo
- **TV ao Vivo** - Assista canais ao vivo com guia de programação (EPG) em tempo real
- **Filmes (VOD)** - Navegue e assista filmes sob demanda
- **Séries** - Organização por temporada/episódio com fila automática de episódios
- **Busca Inteligente** - Filtragem instantânea em todos os tipos de conteúdo
- **Rolagem Virtual** - Performance suave mesmo com mais de 100 mil canais

### 🔒 Controle Parental
- Proteção por PIN (4-6 dígitos) com bloqueio manual ou automático de canais
- Detecção automática de conteúdo adulto (marcadores +18, XXX, Adult)
- Bloqueio por categoria para grupos inteiros de canais
- Três modos de exibição: Ocultar, Ícone de Cadeado ou Desfocar
- Desbloqueio por sessão, que trava novamente ao reiniciar

### 📋 Gerenciamento de Playlists
- Importação de **M3U/M3U8** a partir de arquivos locais ou URLs
- Integração com **Xtream Codes** do seu provedor de IPTV
- **Sistema Multi-Perfil** - Alterne entre múltiplos provedores/playlists
- **Favoritos** - Marque qualquer canal com estrela e encontre-o em uma aba dedicada
- **User-Agent Personalizado** - Presets para TiviMate, VLC, ou insira o seu próprio
- **Acesso Rápido por Categoria** - Barra horizontal para filtragem instantânea por categoria

### 🌐 Suporte a Idiomas
19 idiomas para preferências de áudio e legenda (escandinavos, europeus e internacionais), configuráveis por perfil.

---

## 📥 Instalação

### Media Player MPV

Waytune usa o MPV para reprodução de vídeo. A instalação varia por plataforma:

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install mpv

# Arch Linux
sudo pacman -S mpv

# Fedora
sudo dnf install mpv
```

**macOS:**
```bash
brew install mpv
```

**Windows:**
> **Novidade na v2.3.0:** O MPV já vem empacotado no instalador. Não é necessário instalar separadamente.

Se preferir instalar manualmente: baixe em [mpv.io](https://mpv.io/installation/) ou use `choco install mpv`.

### Baixando o Waytune

1. Acesse [Releases](https://github.com/andrezinhovg/waytune/releases/latest)
2. Baixe a versão para sua plataforma:
   - **Linux (Ubuntu/Debian)**: `.AppImage`, `.deb`
   - **Linux (Arch/Manjaro)**: `-arch.AppImage`
   - **Linux (Fedora/RHEL)**: `.rpm`
   - **Windows**: instalador `.msi` ou `.exe` portátil
   - **macOS**: imagem de disco `.dmg`

**Linux AppImage (Ubuntu/Debian):**
```bash
chmod +x Waytune_*_amd64.AppImage
./Waytune_*_amd64.AppImage
```

**Linux AppImage (Arch/Manjaro):**

> **Importante:** Use a variante `-arch.AppImage` em distros baseadas em Arch. O AppImage padrão empacota bibliotecas WebKit do Ubuntu que conflitam com bibliotecas de sistema mais novas em distros rolling-release, causando um crash na inicialização.

```bash
chmod +x Waytune_*_amd64-arch.AppImage
./Waytune_*_amd64-arch.AppImage
```

---

## 🚀 Primeiros Passos

### 1. Importe uma Playlist

Na primeira execução, escolha seu método de importação:

**Opção A: Arquivo M3U/M3U8**
1. Clique em **"Import M3U Playlist"**
2. Digite um nome de perfil (ex.: "Minha IPTV")
3. Escolha a origem: **Arquivo Local** ou **URL**
4. Clique em **"Import"** e aguarde os canais carregarem

**Opção B: Xtream Codes**
1. Clique em **"Import Xtream Playlist"**
2. Digite um nome de perfil
3. Preencha a URL do servidor, usuário e senha
4. Clique em **"Import"** (carrega TV ao Vivo, Filmes e Séries)

### 2. Configure o EPG (Opcional)

1. Abra **Settings** (ícone de engrenagem) → **General** → **EPG Settings**
2. Informe a URL do seu EPG XMLTV (usuários Xtream recebem isso automaticamente)
3. Clique em **"Update Now"** — o EPG passa a atualizar automaticamente a partir daí

### 3. Comece a Assistir

- Use as abas (All / Live TV / Movies / Series / Favorites) e a barra de categorias para navegar
- Digite na caixa de busca para filtragem instantânea
- Clique em play em qualquer canal — o MPV abre em uma janela separada

**Séries:** Selecione uma série → escolha a temporada → clique em Play em qualquer episódio. Os episódios seguintes entram na fila automaticamente.

**Favoritos:** Passe o mouse sobre o card de um canal e clique na estrela para adicionar ou remover.

**Múltiplos Perfis:** Importe playlists adicionais como perfis separados e alterne entre eles pela tela de configuração inicial.

---

## 🎮 Atalhos de Teclado

| Tecla | Ação |
|-----|--------|
| `Space` | Play/Stop no canal atual |
| `/` | Focar na barra de busca |
| `Escape` | Parar reprodução |
| `Ctrl+1-4` | Alternar entre abas de configuração |

Para os controles do player MPV (tela cheia, volume, avanço, etc.), veja a [documentação de teclado do MPV](https://mpv.io/manual/stable/#keyboard-control).

---

## ❓ FAQ

<details>
<summary><strong>Por que o MPV não abre?</strong></summary>

O MPV precisa estar instalado no seu sistema (exceto no Windows v2.3.0+, que já o inclui empacotado).

Verifique a instalação:
```bash
mpv --version
```

Veja [Instalação](#-instalação) para instruções específicas de cada plataforma.
</details>

<details>
<summary><strong>Posso assistir aos canais diretamente no app?</strong></summary>

Não, o Waytune usa o MPV como player externo. Isso garante amplo suporte a codecs e aceleração por hardware, mas o vídeo é exibido em uma janela separada.
</details>

<details>
<summary><strong>Os dados do EPG não aparecem?</strong></summary>

Verifique:
1. A playlist contém identificadores de EPG (`tvg-id` ou `tvg-name`)
2. A URL do EPG está configurada em Settings → EPG Settings
3. Os dados do EPG foram buscados (clique no botão "Fetch EPG")
4. Aguarde um minuto pelo ciclo de atualização do EPG
</details>

<details>
<summary><strong>Quantos canais o app suporta?</strong></summary>

O Waytune foi testado com mais de 150.000 canais durante o desenvolvimento, sem problemas.
</details>

<details>
<summary><strong>Funciona com VPN?</strong></summary>

Sim. Garanta que sua VPN esteja ativa antes de iniciar os streams.
</details>

<details>
<summary><strong>Minhas credenciais Xtream ficam seguras?</strong></summary>

Sim. Todas as credenciais são armazenadas localmente no seu dispositivo. Nada é enviado a servidores externos. Os logs mascaram automaticamente dados sensíveis.
</details>

<details>
<summary><strong>Posso reproduzir arquivos de vídeo locais?</strong></summary>

Não, o Waytune é feito para streams de IPTV. Use o MPV diretamente para mídia local.
</details>

---

## 🛠️ Solução de Problemas

### Canais com Buffering
- **Verifique a conexão com a internet** - Rode um teste de velocidade
- **Tente outro canal** - Pode ser um problema do provedor/servidor
- **Ajuste o cache do MPV** - Usuários avançados: edite a configuração do MPV

### Séries Não Importam (Xtream)
- **Verifique as credenciais** - Confira novamente usuário/senha
- **Confira o suporte do provedor** - Nem todo provedor Xtream oferece séries
- **Tente importar novamente** - Problemas de rede podem causar importações parciais

### O App Não Inicia
- **Linux**: Garanta que o `.AppImage` tenha permissão de execução (`chmod +x`)
- **Windows**: Execute como administrador ou verifique o Windows Defender
- **macOS**: Permita o app em **Preferências do Sistema → Segurança e Privacidade**

### Problemas no Controle Parental
- **Detecção automática não funciona?** - Salve novamente as configurações para disparar uma nova varredura de canais
- **Modo de bloqueio não mostra canais?** - Atualize para a v2.3.0+ (bug corrigido)
- **Modal de PIN travado?** - Reinicie o app, problema resolvido na v2.3.0

### Logs

**Linux**: `~/.local/share/waytune/logs/waytune.log`
**Windows**: `%APPDATA%\io.github.andrezinhovg.waytune\logs\waytune.log`
**macOS**: `~/Library/Application Support/io.github.andrezinhovg.waytune/logs/waytune.log`

As credenciais são mascaradas automaticamente nos logs.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) (em inglês) para configuração do ambiente de desenvolvimento, padrões de código e diretrizes de PR.

- [Reportar um bug](https://github.com/andrezinhovg/waytune/issues/new)
- [Solicitar uma funcionalidade](https://github.com/andrezinhovg/waytune/issues/new)
- [Participar das discussões](https://github.com/andrezinhovg/waytune/discussions)

---

## 📝 Changelog

Veja [CHANGELOG_USER.md](CHANGELOG_USER.md) (em inglês) para o histórico de versões e notas de lançamento.

---

## 📄 Licença

[GNU General Public License v2.0](LICENSE) — o MPV é licenciado sob GPL v2+, e escolhemos a GPL v2.0 por compatibilidade.

---

## 🙏 Agradecimentos

- **[better-iptv](https://github.com/mewset/better-iptv)** por mewset - o Waytune começou como um fork deste projeto, sob GPL v2
- **[MPV Project](https://mpv.io/)** - Player de mídia com amplo suporte a codecs
- **[Tauri](https://tauri.app/)** - Framework multiplataforma que viabiliza este projeto
- **[Open TV](https://github.com/Fredolx/open-tv)** - Inspiração arquitetural
- **Comunidade IPTV** - Padrões, protocolos e suporte contínuo

---

<div align="center">

  **Feito para entusiastas de IPTV**

</div>
