import 'package:flutter/foundation.dart';

class User {
  final String username;
  final String email;

  User({required this.username, required this.email});
}

class AuthProvider with ChangeNotifier {
  User? _user;
  String? _accessToken;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  String? get accessToken => _accessToken;
  bool get isAuthenticated => _accessToken != null;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Simulate API call delay
      await Future.delayed(const Duration(seconds: 2));

      // Mock authentication - replace with actual API calls
      if (email.isEmpty || password.isEmpty) {
        throw Exception('Please enter email and password');
      }

      if (password.length < 6) {
        throw Exception('Password must be at least 6 characters');
      }

      _accessToken = 'mock_jwt_token_${DateTime.now().millisecondsSinceEpoch}';
      _user = User(
        username: email.split('@').first,
        email: email,
      );
      
      _error = null;
    } catch (e) {
      _error = e.toString();
      _accessToken = null;
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signup(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Simulate API call delay
      await Future.delayed(const Duration(seconds: 2));

      // Mock signup - replace with actual API calls
      if (name.isEmpty || email.isEmpty || password.isEmpty) {
        throw Exception('Please fill all fields');
      }

      if (password.length < 6) {
        throw Exception('Password must be at least 6 characters');
      }

      _accessToken = 'mock_jwt_token_${DateTime.now().millisecondsSinceEpoch}';
      _user = User(username: name, email: email);
      
      _error = null;
    } catch (e) {
      _error = e.toString();
      _accessToken = null;
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void logout() {
    _user = null;
    _accessToken = null;
    _error = null;
    _isLoading = false;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}