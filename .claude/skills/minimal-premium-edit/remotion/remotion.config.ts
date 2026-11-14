import {Config} from '@remotion/cli/config';
// Use o Chrome do sistema quando o download automático do Remotion estiver bloqueado:
//   export REMOTION_BROWSER=/caminho/do/chrome
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
Config.setOverwriteOutput(true);
Config.setConcurrency(Number(process.env.REMOTION_CONCURRENCY || 2));
