// Este arquivo é necessário pelo karma.conf.js e carrega recursivamente todos os arquivos .spec e framework

import { getTestBed } from "@angular/core/testing";
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import "zone.js/testing";

// Primeiro, inicialize o ambiente de teste do Angular.
getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
);
