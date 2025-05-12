/**
 * Este arquivo inclui polyfills necessários pelo Angular e é carregado antes da aplicação.
 * Você pode adicionar seus próprios polyfills extras neste arquivo.
 *
 * Este arquivo é dividido em 2 seções:
 *   1. Polyfills de navegador. Esses são aplicados antes de carregar ZoneJS e são classificados por browsers.
 *   2. Imports de aplicação. Arquivos importados após ZoneJS que devem ser carregados antes da sua aplicação principal.
 *
 * As configurações atuais são para chamadas de API polyfill mínimas que são absolutamente necessárias
 * para usar a aplicação Angular no browser mais recente.
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/**
 * Por padrão, zone.js incorporará todos os polyfills necessários para IE11.
 * Se você não deseja dar suporte ao IE11, você pode remover estes imports.
 */
// import 'zone.js/dist/zone';  // Incluído com Angular CLI.

/***************************************************************************************************
 * IMPORTS DE APLICAÇÃO
 */

/**
 * O conteúdo abaixo é necessário para o Angular. Não remova.
 */
import "zone.js";
