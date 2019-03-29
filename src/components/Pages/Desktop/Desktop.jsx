import React, { Component } from 'react'

import dCipher from 'assets/images/dCipher.svg'
import DesktopImg from 'assets/images/Desktop.svg'
import './Desktop.scss'

class Desktop extends Component {
  render() {
    return (
      <div className="DesktopWrapper">
        <div className="Desktop">
          <img src={dCipher} />
          <p class="Warning">
            <b class="Light">dCipher</b> requires <b>Chrome</b> with <b>MetaMask</b> installed or <b>Opera</b> browser. To use <b class="Light">dCipher</b> on mobile or tablet,
          </p>
          <a href="https://status.im" target="_blank" class="link-status metamask">download <b class="bold-text-5">Status</b></a>
          <img className="DesktopImg" src={DesktopImg} />
        </div>
      </div>
    )
  }
}

export default Desktop
