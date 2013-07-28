from nltk.probability import ELEProbDist, FreqDist
from nltk import NaiveBayesClassifier
from collections import defaultdict

train_samples = {
    'I hate you and you are a bad person': 'neg',
    'I love you and you are a good person': 'pos',
    'I fail at everything and I want to kill people' : 'neg',
    'I win at everything and I want to love people' : 'pos',
    'sad are things are heppening. fml' : 'neg',
    'good are things are heppening. gbu' : 'pos',
    'I am so poor' : 'neg',
    'I am so rich' : 'pos',
    'I hate you mommy ! You are my terrible person' : 'neg',
    'I love you mommy ! You are my amazing person' : 'pos',
    'I want to kill butterflies since they make me sad' : 'neg',
    'I want to chase butterflies since they make me happy' : 'pos',
    'I want to hurt bunnies' : 'neg',
    'I want to hug bunnies' : 'pos',
    'You make me frown' : 'neg',
    'You make me smile' : 'pos',
}

test_samples = [
  'FUCK YOU RASCAL',
  'You are a terrible person and everything you do is bad',
  'I love you all and you make me happy',
  'I frown whenever I see you in a poor state of mind',
  'Finally getting rich from my ideas. They make me smile.',
  'My mommy is poor',
  'I love butterflies. Yay for happy',
  'Everything is fail today and I hate stuff',
]


def gen_bow(text):
    words = text.split()
    bow = {}
    for word in words:
        bow[word.lower()] = True
    return bow


def get_labeled_features(samples):
    word_freqs = {}
    for text, label in train_samples.items():
        tokens = text.split()
        for token in tokens:
            if token not in word_freqs:
                word_freqs[token] = {'pos': 0, 'neg': 0}
            word_freqs[token][label] += 1
    return word_freqs


def get_label_probdist(labeled_features):
    label_fd = FreqDist()
    for item,counts in labeled_features.items():
        for label in ['neg','pos']:
            if counts[label] > 0:
                label_fd.inc(label)
    label_probdist = ELEProbDist(label_fd)
    return label_probdist


def get_feature_probdist(labeled_features):
    feature_freqdist = defaultdict(FreqDist)
    feature_values = defaultdict(set)
    num_samples = len(train_samples) / 2
    for token, counts in labeled_features.items():
        for label in ['neg','pos']:
            feature_freqdist[label, token].inc(True, count=counts[label])
            feature_freqdist[label, token].inc(None, num_samples - counts[label])
            feature_values[token].add(None)
            feature_values[token].add(True)
    for item in feature_freqdist.items():
        print item[0],item[1]
    feature_probdist = {}
    for ((label, fname), freqdist) in feature_freqdist.items():
        probdist = ELEProbDist(freqdist, bins=len(feature_values[fname]))
        feature_probdist[label,fname] = probdist
    return feature_probdist


labeled_features = get_labeled_features(train_samples)

label_probdist = get_label_probdist(labeled_features)

feature_probdist = get_feature_probdist(labeled_features)

classifier = NaiveBayesClassifier(label_probdist, feature_probdist)

for sample in test_samples:
    print "%s | %s" % (sample, classifier.classify(gen_bow(sample)))

classifier.show_most_informative_features()
