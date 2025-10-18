import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/prediction_provider.dart';
import '../../domain/entities/prediction_entity.dart';

class PredictionsTable extends StatelessWidget {
  const PredictionsTable({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<PredictionProvider>(
      builder: (context, provider, child) {
        if (provider.predictions.isEmpty) {
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Column(
                children: [
                  Icon(
                    Icons.psychology_outlined,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No predictions yet',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Run your first AI analysis to see results here',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[500],
                    ),
                  ),
                ],
              ),
            ),
          );
        }

        return Card(
          child: Column(
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(12),
                    topRight: Radius.circular(12),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.history,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Recent Predictions',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Theme.of(context).colorScheme.onPrimaryContainer,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              // Predictions List
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: provider.predictions.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final prediction = provider.predictions[index];
                  return _PredictionTile(
                    prediction: prediction,
                    onDelete: () => provider.deletePrediction(prediction.id),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}

class _PredictionTile extends StatelessWidget {
  final PredictionEntity prediction;
  final VoidCallback onDelete;

  const _PredictionTile({
    required this.prediction,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('MMM dd, yyyy HH:mm');
    
    return ListTile(
      contentPadding: const EdgeInsets.all(16.0),
      leading: CircleAvatar(
        backgroundColor: prediction.isPlanetDetected 
            ? Colors.green.withOpacity(0.2)
            : Colors.red.withOpacity(0.2),
        child: Icon(
          prediction.isPlanetDetected 
              ? Icons.check_circle
              : Icons.cancel,
          color: prediction.isPlanetDetected 
              ? Colors.green
              : Colors.red,
        ),
      ),
      title: Text(
        prediction.result,
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Model: ${prediction.modelName}'),
          Text('Confidence: ${(prediction.confidence * 100).toStringAsFixed(1)}%'),
          Text('Date: ${dateFormat.format(prediction.createdAt)}'),
        ],
      ),
      trailing: IconButton(
        icon: const Icon(Icons.delete_outline),
        onPressed: onDelete,
        tooltip: 'Delete prediction',
      ),
      onTap: () => _showPredictionDetails(context, prediction),
    );
  }

  void _showPredictionDetails(BuildContext context, PredictionEntity prediction) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Prediction Details'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _DetailRow('Result', prediction.result),
            _DetailRow('Model', prediction.modelName),
            _DetailRow('Confidence', '${(prediction.confidence * 100).toStringAsFixed(1)}%'),
            const SizedBox(height: 16),
            Text(
              'Input Parameters:',
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ...prediction.inputParameters.entries.map(
              (entry) => _DetailRow(
                entry.key.toUpperCase(),
                entry.value.toStringAsFixed(2),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final String label;
  final String value;

  const _DetailRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            '$label:',
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
          Text(value),
        ],
      ),
    );
  }
}