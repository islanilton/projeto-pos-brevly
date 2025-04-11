import { createLinkRoute } from './create-link'
import { deleteLinkRoute } from './delete-link'
import { getLinkRoute } from './get-link'
import { listLinksRoute } from './list-links'
import { exportLinksRoute } from './export-links'


export const routes = [
  createLinkRoute,
  deleteLinkRoute,
  getLinkRoute,
  listLinksRoute,
  exportLinksRoute,
]