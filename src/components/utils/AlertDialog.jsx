const AlertDialog = ({ type, message }) => (
  <div className={`alert alert-${type} text-center`}>{message}</div>
);

export default AlertDialog;
