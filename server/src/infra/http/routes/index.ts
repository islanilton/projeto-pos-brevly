import { createLinkRoute } from './create-link'
import { deleteLinkRoute } from './delete-link'
import { getLinkRoute } from './get-link'
import { getLinksRoute } from './get-links'
import { exportLinksRoute } from './export-links'


export const routes = [
  createLinkRoute,
  deleteLinkRoute,
  getLinkRoute,
  getLinksRoute,
  exportLinksRoute,
]