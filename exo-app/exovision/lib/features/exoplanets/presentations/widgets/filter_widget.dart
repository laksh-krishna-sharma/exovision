import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';

class FilterWidget extends StatefulWidget {
  final List<String> filters;
  final String selectedFilter;
  final Function(String) onFilterChanged;
  final bool isMobile;

  const FilterWidget({
    super.key,
    required this.filters,
    required this.selectedFilter,
    required this.onFilterChanged,
    required this.isMobile,
  });

  @override
  State<FilterWidget> createState() => _FilterWidgetState();
}

class _FilterWidgetState extends State<FilterWidget> {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: widget.filters.map((filter) {
          final isSelected = filter == widget.selectedFilter;
          return Padding(
            padding: EdgeInsets.only(right: widget.isMobile ? 8 : 12),
            child: FilterChip(
              filter: filter,
              isSelected: isSelected,
              onTap: () => widget.onFilterChanged(filter),
              isMobile: widget.isMobile,
            ),
          );
        }).toList(),
      ),
    );
  }
}

class FilterChip extends StatelessWidget {
  final String filter;
  final bool isSelected;
  final VoidCallback onTap;
  final bool isMobile;

  const FilterChip({
    super.key,
    required this.filter,
    required this.isSelected,
    required this.onTap,
    required this.isMobile,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(
          horizontal: isMobile ? 16 : 20,
          vertical: isMobile ? 10 : 12,
        ),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.cyan : Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(25),
          border: Border.all(
            color: isSelected ? AppColors.cyan : Colors.white.withOpacity(0.1),
            width: 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.cyan.withOpacity(0.3),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ]
              : [],
        ),
        child: Text(
          filter,
          style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium).copyWith(
            color: isSelected ? Colors.black : Colors.white.withOpacity(0.8),
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    ).animate(delay: (600 + (widget.filters.indexOf(filter) * 50)).ms).fadeIn().slideX(begin: 0.3);
  }
}