/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "/../elements/shared/button-selectors";

import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { ELEMENT_TRANSLATION } from "../../elements/translations/element-translation";
import { LANGUAGES_LIST } from "../../elements/translations/languages-list";
import { urlList } from "../../fixtures/urlList";
import {
  createCategory,
  getCategory,
  updateCategoryTranslation
} from "../support/api/requests/Category";
import { deleteCategoriesStartsWith } from "../support/api/utils/catalog/categoryUtils";
import filterTests from "../support/filterTests";
import { updateTranslationToCategory } from "../support/pages/translationsPage";

filterTests({ definedTags: ["all"], version: "3.0.0" }, () => {
  describe("As an admin I want to manage translations", () => {
    const startsWith = "TestTranslations";
    const randomNumber = faker.datatype.number();
    const name = `${startsWith}${randomNumber}`;

    let category;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteCategoriesStartsWith(startsWith);
      createCategory(name).then(categoryResp => (category = categoryResp));
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    const translatedSeoTitle = `TranslatedSeoTitle${randomNumber}`;

    updateTranslationToCategory({
      categoryName: category.name,
      translatedName,
      translatedDescription,
      translatedSeoTitle,
      translatedSeoDescription
    });
    getCategory(category.id, "PL").then(({ translation }) => {
      expect(translation.name).to.eq(`TranslatedName${randomNumber}`);
      expect(translation.description).to.includes(
        `TranslatedDescription${randomNumber}`
      );
      expect(translation.seoTitle).to.eq(`TranslatedSeoTitle${randomNumber}`);
      expect(translation.seoDescription).to.eq(
        `TranslatedSeoDescription${randomNumber}`
      );
    });
  });

  it("should update translation", () => {
    const randomNumber = faker.datatype.number();
    const startWithUpdate = `Translations_Update_${randomNumber}`;
    const seoTitleUpdate = `${startWithUpdate}_seoTitle`;
    const seoDescriptionUpdate = `${startWithUpdate}_seoDescription`;
    const nameUpdate = `${startWithUpdate}_nameUpdate`;
    const descriptionUpdate = `${startWithUpdate}_descryptionUpdate`;

    updateCategoryTranslation({
      categoryTranslateId: category.id,
      languageCode: "PL",
      seoTitle: "test",
      seoDescription: "test",
      name: "test",
      description: "test"
    })
      .then(() => {
        updateTranslationToCategory({
          categoryName: category.name,
          translatedName: nameUpdate,
          translatedDescription: descriptionUpdate,
          translatedSeoTitle: seoTitleUpdate,
          translatedSeoDescription: seoDescriptionUpdate
        });
        getCategory(category.id, "PL");
      })
      .then(({ translation }) => {
        expect(translation.name).to.eq(nameUpdate);
        expect(translation.description).to.includes(descriptionUpdate);
        expect(translation.seoTitle).to.eq(seoTitleUpdate);
        expect(translation.seoDescription).to.includes(seoDescriptionUpdate);
      });
  });
});
