export type Theme = {
  bg: string;       // fundo claro / papel
  paper: string;    // papel levemente mais escuro (grade, cartões)
  text: string;     // texto sobre fundo claro
  accent: string;   // UMA cor de destaque
  support: string;  // cor de apoio
  dark: string;     // fundo escuro (gráfico, linha)
  captionColor: string; // legendas no rosto continuam brancas
  serif: string;
  sans: string;
};

// Paleta-exemplo do guia: carvão, dourado champagne, creme. Troque via plano.json -> theme.
export const defaultTheme: Theme = {
  bg: '#F4F1EA',
  paper: '#E9E4D8',
  text: '#141414',
  accent: '#B8923F',
  support: '#1F4D3A',
  dark: '#0F0F0F',
  captionColor: '#FFFFFF',
  serif: '"Playfair Display", Georgia, serif',
  sans: 'Inter, Helvetica, Arial, sans-serif',
};

export const mergeTheme = (t?: Partial<Theme>): Theme => ({...defaultTheme, ...(t || {})});
