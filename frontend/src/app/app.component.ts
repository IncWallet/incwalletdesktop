import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { LANG, Language } from './infrastructure/_index';
import { locale as langEn } from './@i18n/en.lang';
import { LocalStorage } from './infrastructure/common-helper';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[id="app"]',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private translateService: TranslateService,
    ) {
  }

  ngOnInit(): void {
    this.translateService.addLangs([Language.en_US]);
    this.translateService.setDefaultLang(Language.en_US);
    [langEn].forEach((locale) => {
        this.translateService.setTranslation(locale.lang, locale.data, true);
    });

    this.translateService.use(
        LocalStorage.hasKey(LANG)
            ? LocalStorage.getValue(LANG)
            : this.translateService.defaultLang
    );
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
