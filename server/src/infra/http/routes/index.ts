import { createLinkRoute } from './create-link'
import { deleteLinkRoute } from './delete-link'
import { exportLinksRoute } from './export-links'
import { getLinkRoute } from './get-link'
import { getLinksRoute } from './get-links'

export const routes = [
  createLinkRoute,
  deleteLinkRoute,
  exportLinksRoute,
  getLinkRoute,
  getLinksRoute,
]