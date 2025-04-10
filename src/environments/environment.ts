// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    baseUrl:  'http://localhost:51554',
    baseUrl2:  'https://localhost:7091',
    authSerials:'',
    loginUrl: "/Login",
    pagination: { size: 20 , offset: 0}
};
//http://134.255.231.67:7080
