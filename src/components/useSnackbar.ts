import { useSnackbar as notistackUseSnackbar } from 'notistack'

export default function _useSnackbar() {
  const {enqueueSnackbar, closeSnackbar} = notistackUseSnackbar()
  return {enqueueSnackbar, closeSnackbar, enqueueApiError}
}