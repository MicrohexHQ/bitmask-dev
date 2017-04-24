import bitmask from 'lib/bitmask'
import Account from 'models/account'
import Provider from 'models/provider'

require('css/bootstrap.less')
require('css/common.less')

class Application {
  constructor() {
  }

  //
  // main entry point for the application
  //
  initialize() {
    window.addEventListener("error", this.showError.bind(this))
    window.addEventListener("unhandledrejection", this.showError.bind(this))
    this.start()
  }

  //
  // (1) check to see if any accounts are authenticated.
  //     if any are, show main panel
  // (2) check to see if any accounts are 'vpn ready'.
  //     if any are, show main panel.
  // (3) otherwise, show login greeter
  //
  start() {
    Provider.list(false).then(
      domains => {
        Account.initializeList(domains)
        Account.active().then(
          accounts => {
            if (0 == accounts.length) {
              Account.vpnReady().then(accounts => {
                if (0 == accounts.length) {
                  this.show('greeter', {showLogin: true})
                } else {
                  this.show('main', {initialAccount: accounts[0]})
                }
              })
            } else {
              accounts.forEach(account => {
                Account.addActive(account)
              })
              this.show('main', {initialAccount: Account.list[0]})
            }
          },
          error => {this.showError(error)}
        )
      },
      error => {this.showError(error)}
    )
  }

  show(panel, properties) {
    this.switcher.show(panel, properties)
  }

  showError(e) {
    this.switcher.showError(e)
    return true
  }

  hideError() {
    this.switcher.hideError()
    return true
  }
}

var App = new Application
export default App