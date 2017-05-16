Changelog
=====================
0.9.5 - la rosa de foc
----------------------

Features
~~~~~~~~
- `#8112 <https://0xacab.org/leap/bitmask-dev/issues/8112>`_: Check validity of key signature
- `#8755 <https://0xacab.org/leap/bitmask-dev/issues/8755>`_: Add account based keymanagement API
- `#8770 <https://0xacab.org/leap/bitmask-dev/issues/8770>`_: Simplify mail status in the cli
- `#8769 <https://0xacab.org/leap/bitmask-dev/issues/8769>`_: Eliminate active user from bonafide
- `#8771 <https://0xacab.org/leap/bitmask-dev/issues/8771>`_: Add json print to the cli
- `#8765 <https://0xacab.org/leap/bitmask-dev/issues/8765>`_: Require a global authentication token for the api
- Initial cli port of the legacy vpn code
- Add VPN API to bitmask.js
- Add vpn get_cert command
- Indicate a successful/failure OpenPGP header import
- Get more detailed status report for email
- VPN and Mail status displayed in the UI
- Port Pixelated UA integration from legacy bitmask
- Add Pixelated Button to the UI
- Add ability to ssh into the bitmask daemon for debug

Bugfixes
~~~~~~~~
- Repeat decryption if signed with attached key
- `#8783 <https://0xacab.org/leap/bitmask-dev/issues/8783>`_: use username instead of provider in the vpn calls
- `#8868 <https://0xacab.org/leap/bitmask-dev/issues/8868>`_: can't upload generated key with bitmask

Misc
~~~~
- Remove usage of soledad offline flag.
- Tests use soledad master instead of develop
- Build bundles with pixelated libraries


0.9.4 - works for you
---------------------

Features
~~~~~~~~
- `#7550 <https://leap.se/code/issues/7550>`_: Add ability to use invite codes during signup
- `#7965 <https://leap.se/code/issues/7965>`_: Add basic keymanagement to the cli.
- `#8265 <https://leap.se/code/issues/8265>`_: Add a REST API and bitmask.js library for it.
- `#8400 <https://leap.se/code/issues/8400>`_: Add manual provider registration.
- `#8435 <https://leap.se/code/issues/8435>`_: Write service tokens to a file for email clients to read.
- `#8486 <https://leap.se/code/issues/8486>`_: Fetch smtp cert automatically if missing.
- `#8487 <https://leap.se/code/issues/8487>`_: Add change password command.
- `#8488 <https://leap.se/code/issues/8488>`_: Add list users to bonafide.
- Use mail_auth token in the core instead of imap/smtp tokens.


Bugfixes
~~~~~~~~
- `#8498 <https://leap.se/code/issues/8498>`_: In case of wrong url don't leave files in the config folder.

