"""
Select Provider Page, used in First Run Wizard
"""
import logging

from PyQt4 import QtCore
from PyQt4 import QtGui

#from leap.base import exceptions as baseexceptions
#from leap.crypto import certs
#from leap.eip import exceptions as eipexceptions

from leap.gui.constants import APP_LOGO
from leap.gui.progress import InlineValidationPage
from leap.gui.styles import ErrorLabelStyleSheet

logger = logging.getLogger(__name__)


class SelectProviderPage(InlineValidationPage):
    def __init__(self, parent=None, providers=None):
        super(SelectProviderPage, self).__init__(parent)

        self.setTitle("Enter Provider")
        self.setSubTitle(
            "Please enter the domain of the provider you want "
            "to use for your connection."
        )
        self.setPixmap(
            QtGui.QWizard.LogoPixmap,
            QtGui.QPixmap(APP_LOGO))

        self.did_cert_check = False
        self.current_page = 'providerselection'

        self.is_done = False

        self.setupSteps()
        self.setupUI()

        self.stepChanged.connect(
            self.onStepStatusChanged)

    def setupUI(self):
        """
        initializes the UI
        """
        providerNameLabel = QtGui.QLabel("h&ttps://")
        # note that we expect the bare domain name
        # we will add the scheme later
        providerNameEdit = QtGui.QLineEdit()
        providerNameEdit.cursorPositionChanged.connect(
            self.reset_validation_status)
        providerNameLabel.setBuddy(providerNameEdit)

        # add regex validator
        providerDomainRe = QtCore.QRegExp(r"^[a-z\d_-.]+$")
        providerNameEdit.setValidator(
            QtGui.QRegExpValidator(providerDomainRe, self))
        self.providerNameEdit = providerNameEdit

        # Eventually we will seed a list of
        # well known providers here.

        #providercombo = QtGui.QComboBox()
        #if providers:
            #for provider in providers:
                #providercombo.addItem(provider)
        #providerNameSelect = providercombo

        self.registerField("provider_domain*", self.providerNameEdit)
        #self.registerField('provider_name_index', providerNameSelect)

        validationMsg = QtGui.QLabel("")
        validationMsg.setStyleSheet(ErrorLabelStyleSheet)
        self.validationMsg = validationMsg
        providerCheckButton = QtGui.QPushButton("check")
        self.providerCheckButton = providerCheckButton

        # cert info

        # this is used in the callback
        # for the checkbox changes.
        # tricky, since the first time came
        # from the exception message.
        # should get string from exception too!
        self.bad_cert_status = "Server certificate could not be verified."

        self.certInfo = QtGui.QLabel("")
        self.certInfo.setWordWrap(True)
        self.certWarning = QtGui.QLabel("")
        self.trustProviderCertCheckBox = QtGui.QCheckBox(
            "&Trust this provider certificate.")

        self.trustProviderCertCheckBox.stateChanged.connect(
            self.onTrustCheckChanged)
        self.providerNameEdit.textChanged.connect(
            self.onProviderChanged)
        self.providerCheckButton.clicked.connect(
            self.onCheckButtonClicked)

        layout = QtGui.QGridLayout()
        layout.addWidget(validationMsg, 0, 2)
        layout.addWidget(providerNameLabel, 1, 1)
        layout.addWidget(providerNameEdit, 1, 2)
        layout.addWidget(providerCheckButton, 1, 3)

        # add certinfo group
        # XXX not shown now. should move to validation box.
        #layout.addWidget(certinfoGroup, 4, 1, 4, 2)
        #self.certinfoGroup = certinfoGroup
        #self.certinfoGroup.hide()

        # add validation frame
        self.setupValidationFrame()
        layout.addWidget(self.valFrame, 4, 1, 4, 2)
        self.valFrame.hide()

        self.setLayout(layout)

    # certinfo

    def setupCertInfoGroup(self):
        # XXX not used now.
        certinfoGroup = QtGui.QGroupBox("Certificate validation")
        certinfoLayout = QtGui.QVBoxLayout()
        certinfoLayout.addWidget(self.certInfo)
        certinfoLayout.addWidget(self.certWarning)
        certinfoLayout.addWidget(self.trustProviderCertCheckBox)
        certinfoGroup.setLayout(certinfoLayout)
        self.certinfoGroup = self.certinfoGroup

    # progress frame

    def setupValidationFrame(self):
        qframe = QtGui.QFrame
        valFrame = qframe()
        valFrame.setFrameStyle(qframe.StyledPanel)  # | qframe.Sunken)
        valframeLayout = QtGui.QVBoxLayout()

        #dummylabel = QtGui.QLabel('test foo')
        #valframeLayout.addWidget(dummylabel)
        valframeLayout.addWidget(self.stepsTableWidget)
        valFrame.setLayout(valframeLayout)
        self.valFrame = valFrame

    # check domain

    def onCheckButtonClicked(self):
        import time
        time.sleep(1)
        self.is_done = True
        self.providerCheckButton.setDisabled(True)
        self.stepChanged.emit('foo check', 0)
        self.valFrame.show()
        self.completeChanged.emit()

    # cert trust verification

    def is_insecure_cert_trusted(self):
        return self.trustProviderCertCheckBox.isChecked()

    def onTrustCheckChanged(self, state):
        checked = False
        if state == 2:
            checked = True

        if checked:
            self.reset_validation_status()
        else:
            self.set_validation_status(self.bad_cert_status)

        # trigger signal to redraw next button
        self.completeChanged.emit()

    def add_cert_info(self, certinfo):
        self.certWarning.setText(
            "Do you want to <b>trust this provider certificate?</b>")
        self.certInfo.setText(
            'SHA-256 fingerprint: <i>%s</i><br>' % certinfo)
        self.certInfo.setWordWrap(True)
        self.certinfoGroup.show()

    def onProviderChanged(self, text):
        provider = self.providerNameEdit.text()
        if provider:
            self.providerCheckButton.setDisabled(False)
        else:
            self.providerCheckButton.setDisabled(True)
        self.completeChanged.emit()

    def reset_validation_status(self):
        """
        empty the validation msg
        """
        self.validationMsg.setText('')

    # pagewizard methods

    def isComplete(self):
        provider = self.providerNameEdit.text()

        if not self.is_done:
            return False

        if not provider:
            return False
        else:
            if self.is_insecure_cert_trusted():
                return True
            if not self.did_cert_check:
                if self.is_done:
                    # XXX sure?
                    return True
            return False

    def populateErrors(self):
        # XXX could move this to ValidationMixin
        # with some defaults for the validating fields
        # (now it only allows one field, manually specified)

        #logger.debug('getting errors')
        errors = self.wizard().get_validation_error(
            self.current_page)
        if errors:
            bad_str = getattr(self, 'bad_string', None)
            cur_str = self.providerNameEdit.text()
            showerr = self.validationMsg.setText
            if bad_str is None:
                # first time we fall here.
                # save the current bad_string value
                self.bad_string = cur_str
                showerr(errors)
            else:
                # not the first time
                if cur_str == bad_str:
                    showerr(errors)
                else:
                    showerr('')

    def cleanup_errormsg(self):
        """
        we reset bad_string to None
        should be called before leaving the page
        """
        self.bad_string = None

    def paintEvent(self, event):
        """
        we hook our populate errors
        on paintEvent because we need it to catch
        when user enters the page coming from next,
        and initializePage does not cover that case.
        Maybe there's a better event to hook upon.
        """
        super(SelectProviderPage, self).paintEvent(event)
        self.populateErrors()

    def initializePage(self):
        self.validationMsg.setText('')
        if hasattr(self, 'certinfoGroup'):
            # XXX remove ?
            self.certinfoGroup.hide()
        self.is_done = False
        self.providerCheckButton.setDisabled(True)

    def validatePage(self):
        # some cleanup before we leave the page
        self.cleanup_errormsg()

        # go
        return True

    def nextId(self):
        wizard = self.wizard()
        if not wizard:
            return
        return wizard.get_page_index('providerinfo')
