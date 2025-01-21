import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";

const EstadoCargaYError = ({ isLoading, loadError }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-white p-6 sm:p-8 shadow-xl rounded-xl max-w-md sm:max-w-lg md:max-w-xl w-full">
        <CircularProgress size={50} color="primary" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center bg-white p-6 sm:p-8 shadow-xl rounded-xl max-w-md sm:max-w-lg md:max-w-xl w-full">
        <p className="text-red-600 text-sm sm:text-base">{loadError}</p>
      </div>
    );
  }

  return null; // No renderiza nada si no hay carga ni error
};

EstadoCargaYError.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loadError: PropTypes.string,
};

export default EstadoCargaYError;
