# Waytune: novo projeto a partir do fork de better-iptv

## Contexto

`andrezinhovg/better-iptv` é um fork de `mewset/better-iptv` (Tauri v2 + Rust
+ React/TS + SQLite + mpv) com uma série de correções de estabilidade já
implementadas e não mergeadas upstream (PRs #56/#57/#58 fechados sem merge
em 31/08/2026, apesar de review técnica positiva). O objetivo agora é
transformar esse fork em um projeto independente, com nome e identidade
próprios, sem depender de futuras decisões do mantenedor upstream.

O nome escolhido é **Waytune**. Verificado sem conflito: nenhum repositório,
pacote npm ou serviço/app comercial encontrado com esse nome (checado via
busca no GitHub, registry do npm e busca web em 12/09/2026).

## Escopo

**Dentro (v1)**:
- Novo repositório `andrezinhovg/waytune`, criado a partir do histórico
  git completo do fork atual (preserva autoria/proveniência).
- Remoção do remote `upstream` (mewset) — divergência total, sem
  cherry-pick futuro de lá.
- Rebrand mecânico de todos os identificadores de produto (ver seção
  dedicada abaixo).
- Conformidade GPL v2 formal (LICENSE ausente no fork atual — ver seção
  dedicada).
- Mesma superfície de features do better-iptv hoje, incluindo todas as
  correções de estabilidade já commitadas (re-render storms, EPG
  self-abort, ResizeObserver stale, mpv fora do runtime async,
  continue-watching, grid responsivo, fix de merge no refresh).
- Build multiplataforma (Linux/Windows/macOS), mantendo o que o Tauri já
  entrega hoje sem esforço extra.

**Fora (v1)**:
- Features novas sem equivalente no better-iptv (perfis múltiplos, sync
  entre dispositivos, recomendações, etc.) — ficam pra uma spec futura,
  depois que o rebrand estiver validado.
- Identidade visual nova (paleta, tipografia, ícone final de marca) — é um
  passo de design separado, não de engenharia; v1 usa um ícone placeholder
  próprio só para não colidir visualmente com o better-iptv.
- Qualquer manutenção ou sincronização com `mewset/better-iptv` daqui pra
  frente.

## Estratégia de repo

1. Fork completo do estado atual de `andrezinhovg/better-iptv` (histórico
   git preservado) para um novo repositório `andrezinhovg/waytune`.
2. Remove o remote `upstream` do novo repositório.
3. O fork antigo (`andrezinhovg/better-iptv`) continua existindo como está,
   sem mudanças — Waytune é um projeto novo, não substitui o fork.

## Conformidade GPL v2

Descoberta relevante: o `LICENSE` nunca foi commitado neste fork. O
upstream só adicionou o arquivo GPL-2.0 real no commit `0df0612` (01/09/2026,
mewset/better-iptv), que nunca foi mergeado aqui — o README sempre
reivindicou GPL v2 (badge + seção de licença), mas sem o texto legal
presente no repositório.

Verificado antes de prosseguir:
- `mewset/better-iptv` tem proveniência própria e limpa (`fork: false,
  parent: null` via GitHub API — não é ele mesmo um fork de outra coisa).
- Não há cabeçalhos de copyright por arquivo no código-fonte para
  preservar além do `LICENSE` no topo do repositório.
- mpv é invocado como subprocesso (`Command::new`, em
  `src-tauri/src/playback/mpv.rs`), não linkado como biblioteca — não há
  questão de "obra derivada por linkagem".

Ações obrigatórias no repositório novo:
1. Trazer o texto completo do GPL-2.0 (do commit `0df0612` upstream) como
   `LICENSE` na raiz do Waytune.
2. Adicionar uma seção "Créditos" no README apontando que Waytune é
   derivado de `better-iptv` (mewset), sob GPL v2 — exigência da seção 2
   da GPL v2 (indicar alterações e preservar avisos), não cortesia.
3. Manter Waytune GPL v2 — sem fechar código, sem adicionar restrições.
4. Repositório público no GitHub já satisfaz a exigência de disponibilizar
   o código-fonte.

## Rebrand mecânico

Identificador reverso escolhido: `io.github.andrezinhovg.waytune`.

Arquivos/campos a alterar:
- `package.json`: `name` → `waytune`
- `src-tauri/Cargo.toml`: `[package] name` → `waytune`, `[lib] name` →
  `waytune_lib`
- `src-tauri/tauri.conf.json`: `productName` → `"Waytune"`, `identifier`
  → `"io.github.andrezinhovg.waytune"`, título da janela em `app.windows`,
  `linux.deb.desktopTemplate` e `linux.rpm.desktopTemplate` →
  `templates/waytune.desktop` (renomeia o arquivo de template também)
- Ícones em `src-tauri/icons/`: novo conjunto próprio (placeholder simples
  é suficiente pro v1 — ver seção "Fora de escopo")
- `README.md`, `CHANGELOG.md`, `CHANGELOG_USER.md`, `CONTRIBUTING.md`:
  substitui menções a "Better IPTV" / `mewset/better-iptv` por Waytune /
  `andrezinhovg/waytune`, preservando a seção de créditos ao projeto
  original (ver seção GPL acima)
- `.github/workflows/*`: ajusta nomes de artefato e badges; remove
  passos específicos do fluxo de publicação AUR do mewset (não se aplica
  ao Waytune)

## Verificação

- `npm run tauri build` local no Linux (ambiente Hyprland atual) — confirma
  que o binário sobe com nome, ícone e identifier novos.
- Build limpo via CI para Windows e macOS (sem hardware local pra testar
  smoke manual nessas plataformas).
- Smoke test manual no Linux: abrir o grid de canais, continue-watching,
  trocar de canal — confirma que a baseline herdada de estabilidade
  continua funcionando após o rebrand.
- Sem testes automatizados novos: o rebrand não introduz lógica, só
  renomeia identificadores e strings — nada aqui justifica um teste
  dedicado.
