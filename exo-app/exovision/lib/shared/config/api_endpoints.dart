class ApiEndpoints {
  static const String baseUrl = 'https://api.exovision.com';
  static const String apiVersion = '/v1';
  
  // Auth endpoints
  static const String login = '$baseUrl$apiVersion/auth/login';
  static const String signup = '$baseUrl$apiVersion/auth/signup';
  static const String logout = '$baseUrl$apiVersion/auth/logout';
  static const String refreshToken = '$baseUrl$apiVersion/auth/refresh';
  
  // Exoplanet endpoints
  static const String exoplanets = '$baseUrl$apiVersion/exoplanets';
  static const String exoplanetDetails = '$baseUrl$apiVersion/exoplanets/{id}';
  static const String searchExoplanets = '$baseUrl$apiVersion/exoplanets/search';
  static const String favoriteExoplanets = '$baseUrl$apiVersion/exoplanets/favorites';
  
  // Prediction endpoints
  static const String predictions = '$baseUrl$apiVersion/predictions';
  static const String makePrediction = '$baseUrl$apiVersion/predictions/predict';
  static const String predictionModels = '$baseUrl$apiVersion/predictions/models';
  
  // User endpoints
  static const String userProfile = '$baseUrl$apiVersion/user/profile';
  static const String updateProfile = '$baseUrl$apiVersion/user/profile';
  static const String changePassword = '$baseUrl$apiVersion/user/change-password';
}