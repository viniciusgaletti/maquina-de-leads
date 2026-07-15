/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = new Collection({
      name: 'leads',
      type: 'base',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'address',
          type: 'text',
          required: true,
        },
        {
          name: 'websiteUrl',
          type: 'url',
          required: false,
        },
        {
          name: 'siteStatus',
          type: 'select',
          required: true,
          maxSelect: 1,
          values: ['pendente', 'sem_site', 'quebrado', 'ok'],
        },
        {
          name: 'lastCheckedAt',
          type: 'date',
          required: false,
        },
      ],
    })

    return app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('leads')

    return app.delete(collection)
  },
)
