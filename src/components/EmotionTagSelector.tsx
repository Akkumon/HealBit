
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEmotionTags, EmotionTag } from '@/hooks/useEmotionTags';
import { MoodType } from '@/types';
import { cn } from '@/lib/utils';

interface EmotionTagSelectorProps {
  mood: MoodType;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

const EmotionTagSelector: React.FC<EmotionTagSelectorProps> = ({
  mood,
  selectedTags,
  onTagsChange,
  className
}) => {
  const { getSuggestedTags, getTagsByCategory, toggleTag: hookToggleTag } = useEmotionTags();

  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newTags);
  };

  const renderTagGroup = (title: string, tags: EmotionTag[]) => {
    if (tags.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <Button
                key={tag.id}
                variant="outline"
                size="sm"
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  'text-xs transition-all duration-200',
                  isSelected && tag.color,
                  isSelected && 'border-current'
                )}
              >
                <span className="mr-1">{tag.icon}</span>
                {tag.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  const suggestedTags = getSuggestedTags(mood);
  const otherPositive = getTagsByCategory('positive').filter(
    tag => !suggestedTags.includes(tag)
  );
  const otherProcessing = getTagsByCategory('processing').filter(
    tag => !suggestedTags.includes(tag)
  );
  const otherDifficult = getTagsByCategory('difficult').filter(
    tag => !suggestedTags.includes(tag)
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">How are you feeling?</CardTitle>
        <CardDescription>
          Select any emotions that resonate with you. You can choose multiple.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderTagGroup('Suggested for you', suggestedTags)}
        
        {otherPositive.length > 0 && renderTagGroup('Positive', otherPositive)}
        {otherProcessing.length > 0 && renderTagGroup('Processing', otherProcessing)}
        {otherDifficult.length > 0 && renderTagGroup('Difficult', otherDifficult)}
        
        {selectedTags.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Selected: {selectedTags.length} emotion{selectedTags.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionTagSelector;
