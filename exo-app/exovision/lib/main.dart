import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:provider/provider.dart';

import 'app/routes/app_pages.dart';
import 'app/redux/store.dart';
import 'app/redux/app_state.dart';
import 'app/theme/app_theme.dart';
import 'features/auth/presentations/providers/auth_provider.dart';
import 'features/home/presentations/providers/home_providers.dart';
import 'features/prediction/presentation/providers/prediction_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  final store = await createStore();
  
  runApp(ExovisionApp(store: store));
}

class ExovisionApp extends StatelessWidget {
  final Store<AppState> store;

  const ExovisionApp({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => HomeProvider()),
        ChangeNotifierProvider(create: (_) => PredictionProvider()),
      ],
      child: StoreProvider<AppState>(
        store: store,
        child: MaterialApp.router(
          title: 'Exovision',
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: ThemeMode.dark,
          routerConfig: AppPages.router,
          debugShowCheckedModeBanner: false,
        ),
      ),
    );
  }
}