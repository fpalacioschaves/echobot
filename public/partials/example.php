<?php


function testAccount()
{
    $accountManager = new AccountManager();
    print_r($accountManager->getAccount());
}

function testAnalysis()
{
    $textrazor = new TextRazor();

    $textrazor->addExtractor('entities');
    $textrazor->addExtractor('words');
    $textrazor->addExtractor('spelling');

    $textrazor->addEnrichmentQuery('fbase:/location/location/geolocation>/location/geocode/latitude');
    $textrazor->addEnrichmentQuery('fbase:/location/location/geolocation>/location/geocode/longitude');

    $text = 'LONDON - Barclays misled shareholders and the public about one of the biggest investments in the banks history, a BBC Panorama investigation has found.';

    $response = $textrazor->analyze($text);
    if (isset($response['response']['entities'])) {
        foreach ($response['response']['entities'] as $entity) {
            print('Entity ID: ' . $entity['entityId']);
            $entityData = (isset($entity['data']) ? $entity['data'] : null);

            if ( ! is_null($entityData)) {
                print(PHP_EOL);
                print('Entity Latitude: ' . $entityData['fbase:/location/location/geolocation>/location/geocode/latitude'][0]);
                print(PHP_EOL);
                print('Entity Longitude: ' . $entityData['fbase:/location/location/geolocation>/location/geocode/longitude'][0]);
            }
            print(PHP_EOL);
        }
    }
}

function testClassifier()
{
    $textrazorClassifier = new ClassifierManager();

    $classifierId = 'test_cats_php';

    try {
        print_r($textrazorClassifier->deleteClassifier($classifierId));
    } catch (Exception $e) {
        // Silently ignore missing classifier for now.
    }

    // Define some new categories and upload them as a new classifier.
    $newCategories = [];
    array_push($newCategories, ['categoryId' => '1', 'query' => 'concept("banking")']);
    array_push($newCategories, ['categoryId' => '2', 'query' => 'concept("health")']);

    $textrazorClassifier->createClassifier($classifierId, $newCategories);

    // Test the new classifier out with an analysis request.
    $textrazor = new TextRazor();
    $textrazor->addClassifier($classifierId);

    $text     = 'Barclays misled shareholders and the public about one of the biggest investments in the banks history, a BBC Panorama investigation has found.';
    $response = $textrazor->analyze($text);

    print_r($response['response']);

    // The client offers various methods for manipulating your stored classifier.
    print_r($textrazorClassifier->allCategories($classifierId));

    print_r($textrazorClassifier->deleteClassifier($classifierId));
}

function testEntityDictionary()
{
    $textrazorDictionary = new DictionaryManager();

    $dictionaryId = 'test_ents_php';

    try {
        print_r($textrazorDictionary->deleteDictionary($dictionaryId));
    } catch (Exception $e) {
        // Silently ignore missing dictionary for now.
    }

    // Define a new dictionary, then add some test entries
    print_r($textrazorDictionary->createDictionary($dictionaryId, 'STEM', true, 'eng'));

    $newEntities = [];
    array_push($newEntities, ['id' => 'TV_1', 'text' => 'BBC Panorama']);

    print_r($textrazorDictionary->addEntries($dictionaryId, $newEntities));

    // To use the new dictionary, simply add its ID to your analysis request.

    $textrazor = new TextRazor();

    $textrazor->addEntityDictionary($dictionaryId);

    $text     = 'Barclays misled shareholders and the public about one of the biggest investments in the banks history, a BBC Panorama investigation has found.';
    $response = $textrazor->analyze($text);

    // The matched entities will be available in the response

    print_r($response['response']['entities']);

    // The client offers various methods for manipulating your stored dictionary entries.

    var_dump($textrazorDictionary->getEntry($dictionaryId, 'TV_1'));

	var_dump($textrazorDictionary->allEntries($dictionaryId, 10));

	var_dump($textrazorDictionary->getDictionary($dictionaryId));

	var_dump($textrazorDictionary->allDictionaries());

	var_dump($textrazorDictionary->deleteDictionary($dictionaryId));
}

testAccount();
testAnalysis();
testEntityDictionary();
testClassifier();