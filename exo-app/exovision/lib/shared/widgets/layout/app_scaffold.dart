import 'package:flutter/material.dart';
import '../common/space_background.dart';

class AppScaffold extends StatelessWidget {
  final String? title;
  final Widget body;
  final Widget? floatingActionButton;
  final Widget? bottomNavigationBar;
  final bool showAppBar;
  final List<Widget>? actions;
  final Widget? drawer;
  final bool extendBodyBehindAppBar;

  const AppScaffold({
    super.key,
    this.title,
    required this.body,
    this.floatingActionButton,
    this.bottomNavigationBar,
    this.showAppBar = true,
    this.actions,
    this.drawer,
    this.extendBodyBehindAppBar = false,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: extendBodyBehindAppBar,
      appBar: showAppBar
          ? AppBar(
              title: title != null ? Text(title!) : null,
              backgroundColor: Colors.transparent,
              elevation: 0,
              actions: actions,
              flexibleSpace: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.purple.withOpacity(0.1),
                      Colors.blue.withOpacity(0.1),
                    ],
                  ),
                ),
              ),
            )
          : null,
      drawer: drawer,
      body: Stack(
        children: [
          const SpaceBackground(),
          SafeArea(
            child: body,
          ),
        ],
      ),
      floatingActionButton: floatingActionButton,
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}