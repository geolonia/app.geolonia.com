# CLAUDE.md

## ブランチ運用ルール（MUST）

- default branch は `develop`（GitHub organization rule で保護されているのはこのブランチのみ）。production 環境が参照するのは `master`（このリポジトリに `main` は存在しない）。
- `master` が branch protection で保護されていなくても、`develop` を経由せず `master` へ直接変更を加えてはならない。
- `master` への直接変更は staging 環境での動作確認をスキップして production 環境へ変更を適用することになるため、原則禁止。
- production 環境（`master`）が staging 環境（`develop`）よりも進んでいる（内容が乖離した）状態を発生させてはならない。
- PR は必ず `develop` を経由して `master` に取り込むこと。feature/fix ブランチは `develop` から作成し、`develop` を base に PR を作成すること。
- PR の base branch を `master` に向けてはならない。
