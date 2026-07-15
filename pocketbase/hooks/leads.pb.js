/// <reference path="../pb_data/types.d.ts" />

// Cópia da lógica de classificação de site. A versão canônica testável (via Vitest) vive em
// src/lib/site-checker.ts — hooks PocketBase rodam numa VM JS (Goja) separada do bundle do
// frontend, sem acesso a `fetch` nem aos módulos TS do frontend, por isso a duplicação é
// deliberada (ver KTD5 do plano). Qualquer mudança na regra de classificação deve ser
// replicada nos dois arquivos.
function classifySiteStatus(url) {
  if (!url) {
    return 'sem_site'
  }

  try {
    let res = $http.send({ url: url, method: 'HEAD', timeout: 8 })

    if (res.statusCode === 405) {
      res = $http.send({ url: url, method: 'GET', timeout: 8 })
    }

    const status = res.statusCode
    const isSuccess = (status >= 200 && status < 300) || (status >= 300 && status < 400)
    return isSuccess ? 'ok' : 'quebrado'
  } catch (err) {
    return 'quebrado'
  }
}

function classifyLead(record) {
  const url = record.get('websiteUrl')
  record.set('siteStatus', classifySiteStatus(url))
  record.set('lastCheckedAt', new Date())
}

onRecordCreateRequest((e) => {
  classifyLead(e.record)
  e.next()
}, 'leads')

onRecordUpdateRequest((e) => {
  classifyLead(e.record)
  e.next()
}, 'leads')
