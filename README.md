# Trainer App

Personal trainer web app instalável como PWA. Stack: Next.js 14, Tailwind, API Anthropic.

## Deploy no Render (mesmo fluxo do ibope-next)

1. Sobe o zip como repo no GitHub
2. Render → New Web Service → conecta o repo
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Variável de ambiente: `ANTHROPIC_KEY` (sua chave Anthropic)
6. Deploy → abre a URL no celular → "Adicionar à tela inicial"

## Funcionalidades

- **Hoje**: treino do dia (split A/B/C), check-in de peso/sono/FC/energia/dor, timer de descanso flutuante
- **Corpo**: gráfico de peso com histórico real (jan–mai 2026 importado), métricas de composição corporal
- **Progresso**: evolução de carga por exercício (compostos principais), médias de bem-estar
- **Ciclo**: semana do mesociclo, análise de estagnação, divisão semanal
- **IA**: consulta contextual ao Claude (substituições, adaptações, dúvidas — botão fixo em todas as telas)

## Dados

- Histórico de peso (jan–mai 2026) já embutido no código
- Novos registros ficam no localStorage do dispositivo
- Sem banco de dados externo = sem custo adicional
