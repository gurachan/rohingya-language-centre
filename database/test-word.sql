INSERT INTO dictionary_words
(
english_word,
slug,
ipa,
part_of_speech,
status
)
VALUES
(
'water',
'water',
'/ˈwɔːtər/',
'noun',
'published'
);


INSERT INTO rohingya_meanings
(
word_id,
hanifi_meaning
)
VALUES
(
LAST_INSERT_ID(),
'𐴝𐴢𐴣𐴝'
);


INSERT INTO examples
(
word_id,
english_example,
hanifi_example
)
VALUES
(
LAST_INSERT_ID(),
'I drink water.',
'𐴃𐴢 𐴐𐴦𐴝 𐴝𐴢𐴣𐴝'
);