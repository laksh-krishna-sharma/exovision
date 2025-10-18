import 'package:flutter/foundation.dart';

class HomeProvider with ChangeNotifier {
  String? _username;
  bool _isLoading = false;

  String? get username => _username;
  bool get isLoading => _isLoading;

  Future<void> loadUserData() async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    // For now, use mock data - replace with actual API call
    _username = 'Explorer';
    
    _isLoading = false;
    notifyListeners();
  }
}