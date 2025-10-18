import 'package:flutter/material.dart';
import '../../../../app/theme/text_styles.dart';

class SectionHeader extends StatelessWidget {
  final String title;
  final bool isMobile;

  const SectionHeader({
    super.key,
    required this.title,
    required this.isMobile,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: isMobile
          ? Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            )
          : Theme.of(context).textTheme.headlineLarge?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
      textAlign: TextAlign.center,
    );
  }
}