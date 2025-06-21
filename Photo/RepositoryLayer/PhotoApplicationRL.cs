using Microsoft.Data.SqlClient;
using Photo.CommonLayer.Models;

namespace Photo.RepositoryLayer
{
    public class PhotoApplicationRL : IPhotoApplicationRL
    {
        public readonly IConfiguration _configuration;
        public readonly SqlConnection _sqlConnection;
        int ConnectionTimeOut = 1800;
        public PhotoApplicationRL(IConfiguration configuration)
        {
            _configuration = configuration;
            _sqlConnection = new SqlConnection(_configuration["ConnectionStrings:SqlServerDBConnection"]);
            //_mySqlConnection = new MySqlConnection(_configuration["ConnectionStrings:MySqlDBConnection"]);
        }

        public async Task<ReadInformationResponse> Person()
        {
            ReadInformationResponse response = new ReadInformationResponse();
            response.person = new List<Person>();
            response.IsSuccess = true;
            response.Message = "Success";

            try
            {
                string StoreProcedure = "usp_ViewAll";

                // Ensure connection is open
                if (_sqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _sqlConnection.OpenAsync();
                }

                using (SqlCommand sqlCommand = new SqlCommand(StoreProcedure, _sqlConnection))
                {
                    sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    sqlCommand.CommandTimeout = ConnectionTimeOut;

                    using (SqlDataReader _sqlDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        if (_sqlDataReader.HasRows)
                        {
                            while (await _sqlDataReader.ReadAsync())
                            {
                                Person getResponse = new Person();

                                // Fixed: Changed *sqlDataReader to _sqlDataReader
                                getResponse.Attach_Name = _sqlDataReader["ASSES_NAME"] != DBNull.Value ?
                                    _sqlDataReader["ASSES_NAME"].ToString() : string.Empty;

                                getResponse.TIN_Info = _sqlDataReader["NEW_TIN"] != DBNull.Value ?
                                    _sqlDataReader["NEW_TIN"].ToString() : string.Empty;

                                // Fixed: Make sure column name matches in both places
                                getResponse.Attach_file = _sqlDataReader["ATTACH_DATA"] != DBNull.Value ?
                                    (byte[])_sqlDataReader["ATTACH_DATA"] : null;

                                // Optional: Add Base64 string property if needed for web display
                                if (getResponse.Attach_file != null)
                                {
                                    // You can add a Base64String property to your Person class
                                    // getResponse.Attach_file_Base64 = Convert.ToBase64String(getResponse.Attach_file);
                                }

                                response.person.Add(getResponse);
                            }
                        }
                        else
                        {
                            response.Message = "No data found in database";
                            // Still keep IsSuccess = true since the operation succeeded, just no data
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Message: " + ex.Message;

                // Log the full exception for debugging
                // _logger.LogError(ex, "Error in Person() method");
                Console.WriteLine($"Error in Person(): {ex}");
            }
            finally
            {
                if (_sqlConnection.State == System.Data.ConnectionState.Open)
                {
                    await _sqlConnection.CloseAsync();
                }
            }

            return response;
        }
    }
}
