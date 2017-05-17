:LastChangedDate: $LastChangedDate$
:LastChangedRevision: $LastChangedRevision$
:LastChangedBy: $LastChangedBy$

.. _qa:

Testing and Reporting
================================ 

`Latest bundles`_ for the next release cycle are automatically built by our
Gitlab CI for every commit in master.

Beginning with 0.9.5, we have ported again the VPN service into the Bitmask
client. Choose the following testing providers (beware that no guarantee about
continuity of the accounts is made at this point): 

* For Encrypted Email, test against ``https://cdev.bitmask.net``
* For VPN, test against ``https://demo.bitmask.net``

.. _`Latest bundles`: https://0xacab.org/leap/bitmask-dev/builds/artifacts/master/download?job=bitmask_latest_bundle

Reporting bugs
--------------------------------

* Bug reports go into our `Issue Tracker`_. 
* `Here`_ is some very good read about what constitutes a `good bug report`_.
* Have also a look at the :ref:`Known Issues <issues>` page.

.. _`Issue Tracker`: https://leap.se/code
.. _`Here`: http://www.chiark.greenend.org.uk/~sgtatham/bugs.html
.. _`good bug report`: http://www.chiark.greenend.org.uk/~sgtatham/bugs.html

Tips for QA
--------------------------------

If you want to give a hand testing the unreleased bundles, please follow the
following tips:

* Focus all your efforts, if possible, on whatever is *the* golden distro at
  the time of the release.  This currently is: Ubuntu 16.04.x LTS, 64bits, with
  Unity as the default desktop environment.
  It's very important to have a reference environment as bug-free as possible,
  before trying to solve issues that are present in other distributions or window
  managers.
* Identify all issues that need help in the QA phase. You can do that going to
  the bug tracker, and filtering all the issues for a given release that are in
  the QA state.
* If the issue is solved in your tests for this alpha release, please add a
  comment to the issue stating the results of your tests, and the platform and
  desktop environment in which your tests took place.  But please do not change
  the QA status on the issue. We generally leave this role to the author of the
  original issue, or to the person playing the role of the release QA master.
* Always test with a newly created account (specially relevant when testing
  email candidates)
* Always test with the reference Mail User Agent (currently, Thunderbird, in
  whatever version is present in the reference distribution).
* Remove also any thunderbird configuration, start a freshly configured account.
* If you find a new bug, please make sure that it hasn't already been reported
  in the issue tracker. If you are absolutely certain that you have found a new
  bug, please attach a log of a new bitmask session, which should contain
  *only* the behaviour needed to reproduce the bug you are reporting.

Xenial live image testing
-------------------------

Pasting the following lines in a terminal will help you testing the latest
bundle from inside a virtual machine running a **live image for xenial** (note
that this is **not** an installation method!)::

  curl https://0xacab.org/leap/bitmask-dev/raw/master/docs/testing/latest-bundle-xenial | bash


Thunderbird integration
-----------------------

These are the steps for testing the thunderbird integration:

1. From within Thunderbird, install the `Bitmask Thunderbird Extension`_.
2. Enable the menu bar: Right Click in the top bar > Menu Bar
3. Run Bitmask
4. Create a Bitmask Account: From the menubar, click on File > New > Bitmask Account
5. Fill in your name. This can be anything.
6. Fill in your username, in the form "username@provider"

.. _`Bitmask Thunderbird Extension`: https://addons.mozilla.org/en-us/thunderbird/addon/bitmask/
