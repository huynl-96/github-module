import type { ModuleOptions } from '../../../../module'
import { decodeParams, fetchRepositoryContributors, overrideConfig } from '../../utils/queries'
import { GithubContributorsQuery } from '../../../types'
// @ts-ignore
import { addPrerenderPath } from '../../utils/prerender'
import * as imports from '#imports'

const moduleConfig: ModuleOptions = imports.useRuntimeConfig().github

let handler
if (process.env.NODE_ENV === 'development' || moduleConfig.disableCache) {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  handler = imports.defineEventHandler
} else {
  // @ts-ignore
  // eslint-disable-next-line import/namespace
  handler = imports.defineCachedEventHandler
}

// eslint-disable-next-line import/namespace
export default handler(
  async (event) => {
    addPrerenderPath(event)
    // Get query
    const query = decodeParams(event.context.params.query) as GithubContributorsQuery

    // Merge query in module config
    const githubConfig = overrideConfig(moduleConfig, query)

    // Fetch contributors from GitHub
    return await fetchRepositoryContributors(query, githubConfig)
  },
  {
    maxAge: 60 // cache for one minute
  }
)
