// Libraries
import {FC, useEffect} from 'react'
import {withRouter, WithRouterProps} from 'react-router'
import auth0js from 'auth0-js'

// APIs
import {postSignout} from 'src/client'
import {getAuth0Config} from 'src/authorizations/apis'

// Constants
import {CLOUD, CLOUD_URL, CLOUD_LOGOUT_PATH} from 'src/shared/constants'

// Components
import {ErrorHandling} from 'src/shared/decorators/errors'

// Utils
import {isFlagEnabled} from 'src/shared/utils/featureFlag'

const Logout: FC<WithRouterProps> = ({router}) => {
  const handleSignOut = async () => {
    if (CLOUD && isFlagEnabled('regionBasedLoginPage')) {
      const config = await getAuth0Config()
      const auth0 = new auth0js.WebAuth({
        domain: config.domain,
        clientID: config.clientID,
      })
      auth0.logout({})
      return
    }
    if (CLOUD) {
      window.location.href = `${CLOUD_URL}${CLOUD_LOGOUT_PATH}`
      return
    } else {
      const resp = await postSignout({})

      if (resp.status !== 204) {
        throw new Error(resp.data.message)
      }

      router.push(`/signin`)
    }
  }

  useEffect(() => {
    handleSignOut()
  }, [])
  return null
}

export default ErrorHandling(withRouter<WithRouterProps>(Logout))
