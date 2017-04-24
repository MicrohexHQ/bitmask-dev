//
// An account is an abstraction of a user and a provider.
// The user part is optional, so an Account might just represent a provider.
//

import bitmask from 'lib/bitmask'
import Provider from 'models/provider'

export default class Account {

  constructor(address, props={}) {
    this.address = address
    this._authenticated = props.authenticated
  }

  //
  // currently, bitmask.js uses address for id, so we return address here too.
  // also, we don't know uuid until after authentication.
  //
  // TODO: change to uuid when possible.
  //
  get id() {
    return this._address
  }

  get domain() {
    return this._address.split('@')[1]
  }

  get address() {
    return this._address
  }

  set address(address) {
    if (!address.match('@')) {
      this._address = '@' + address
    } else {
      this._address = address
    }
  }

  get userpart() {
    return this._address.split('@')[0]
  }

  get authenticated() {
    return this._authenticated
  }

  getProvider() {
    if (this.provider) {
      return new Promise((resolve, reject) => {
        resolve(this.provider)
      })
    } else {
      return Provider.get(this.domain).then(provider => {
        this.provider = provider
        return provider
      })
    }
  }

  //
  // returns a promise, fulfill is passed account object
  //
  login(password, autoSetupProvider=false) {
    return bitmask.bonafide.user.auth(this.address, password, autoSetupProvider).then(
      response => {
        if (response.uuid) {
          this._uuid = response.uuid
          this._authenticated = true
        }
        return this
      }
    )
  }

  //
  // returns a promise, fulfill is passed account object
  //
  logout() {
    return bitmask.bonafide.user.logout(this.id).then(
      response => {
        this._authenticated = false
        this._address = '@' + this.domain
        return this
      }
    )
  }

  //
  // returns the matching account in the list of accounts
  //
  static find(address) {
    // search by full address
    let account = Account.list.find(i => {
      return i.address == address
    })
    // failing that, search by domain
    if (!account) {
      let domain = null
      if (address.indexOf('@') == -1) {
        domain = '@' + address
      } else {
        domain = '@' + address.split('@')[1]
      }
      account = Account.list.find(i => {
        return i.address == domain
      })
      if (account) {
        account.address = address
      }
    }
    return account
  }

  static findOrAdd(address) {
    let account = Account.find(address)
    if (!account) {
      account = new Account(address)
      Account.list.push(account)
    }
    return account
  }

  //
  // returns a list of the authenticated accounts
  //
  static active() {
    return bitmask.bonafide.user.list().then(
      response => {
        let list = []
        for (let accountProps of response) {
          list.push(new Account(accountProps.userid, accountProps))
        }
        return list
      }
    )
  }

  static vpnReady() {
    return Provider.list(false).then(domains => {
      let promises = domains.map(domain => {
        return new Promise((resolve, reject) => {
          bitmask.vpn.check(domain).then(status => {
            if (status.vpn != 'disabled' && status.installed && status.vpn_ready) {
              resolve(domain)
            } else {
              resolve("")
            }
          }, error => {
            resolve("")
          })
        })
      })
      return Promise.all(promises).then(domains => {
        domains = domains.filter(i => {
          return i != ""
        })
        return domains.map(domain => {
          return Account.find(domain)
        })
      })
    })
  }

  static add(account) {
    if (!Account.list.find(i => {return i.id == account.id})) {
      Account.list.push(account)
    }
  }

  //
  // For now, accounts are really just providers. Eventually,
  // there will be a separate account and provider list.
  //
  // Returns the account in the list that is closest to the one
  // We removed.
  //
  static remove(account) {
    return bitmask.bonafide.provider.delete(account.domain).then(
      response => {
        let index = Account.list.findIndex(i => {
          return i.id == account.id
        })
        Account.list = Account.list.filter(i => {
          return i.id != account.id
        })
        if (Account.list.length == 0) {
          return null
        } else if (index >= Account.list.length) {
          index = index - 1
        } else if (index == -1) {
          index = 0
        }
        return Account.list[index]
      }
    )
  }

  static create(address, password, invite=null) {
    return bitmask.bonafide.user.create(address, password, invite).then(
      response => {
        return new Account(address)
      }
    )
  }

  static initializeList(domains) {
    for (let domain of domains) {
      Account.add(new Account(domain))
    }
  }

  //
  // inserts at the front of the account list
  // removing any other accounts with the same domain.
  //
  // this is a temporary hack to support the old behavior
  // util the backend has a proper concept of an account list.
  //
  static addActive(account) {
    Account.list = Account.list.filter(i => {
      return i.domain != account.domain
    })
    Account.list.unshift(account)
  }
}

Account.list = []
