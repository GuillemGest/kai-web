import { InMemoryDownloadRepository } from '../infrastructure/InMemoryDownloadRepository'
import { GetDownloads } from './GetDownloads'

const downloadRepository = new InMemoryDownloadRepository()

export const downloadsUseCases = {
  getDownloads: new GetDownloads(downloadRepository),
}
