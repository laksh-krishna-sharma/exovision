import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';

class LoadingIndicator extends StatelessWidget {
  final String? message;
  final bool isMobile;
  final double size;

  const LoadingIndicator({
    super.key,
    this.message,
    required this.isMobile,
    this.size = 40.0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(isMobile ? 20 : 24),
      decoration: BoxDecoration(
        color: AppColors.surface.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.cyan),
            ),
          ),
          if (message != null) ...[
            SizedBox(height: isMobile ? 12 : 16),
            Text(
              message!,
              style: (isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
                  .copyWith(color: Colors.white70),
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    ).animate().fadeIn().scale();
  }
}

class LinearLoadingIndicator extends StatelessWidget {
  final String? message;

  const LinearLoadingIndicator({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        LinearProgressIndicator(
          backgroundColor: Colors.white.withOpacity(0.1),
          valueColor: AlwaysStoppedAnimation<Color>(AppColors.cyan),
        ),
        if (message != null) ...[
          SizedBox(height: 8),
          Text(
            message!,
            style: TextStyles.bodySmall.copyWith(color: Colors.white70),
          ),
        ],
      ],
    );
  }
}