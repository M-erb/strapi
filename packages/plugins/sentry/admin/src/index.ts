import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';

import { pluginId } from './pluginId';

const name = pluginPkg.strapi.name;

// eslint-disable-next-line import/no-default-export
export default {
  register(app: any) {
    app.registerPlugin({
      id: pluginId,
      name,
    });
  },
  bootstrap() {},
  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
