import 'package:flutter/foundation.dart';

class User {
  final String username;
  
  User({required this.username});
}

class HomeProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;

  User? get user => _user;
  bool get isLoading => _isLoading;

  Future<void> loadUserData() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    // For now, use mock data - replace with actual API call
    _user = User(username: 'Explorer');
    
    _isLoading = false;
    notifyListeners();
  }
}