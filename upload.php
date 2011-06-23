<?php
error_reporting(E_ALL);
ini_set('display_startp_errors', 1);
ini_set('display_errors', 1);

$dossierModels = 'models/';
$dossierTextures = 'textures/';
$fichier = basename($_FILES['osgjsFile']['name']);
$taille_maxi = 10000000;
$taille = filesize($_FILES['osgjsFile']['tmp_name']);
$extensions = array('.json', '.osgjs', '.zip');
$extension = strrchr($_FILES['osgjsFile']['name'], '.');
//Début des vérifications de sécurité...
if (!in_array($extension, $extensions)) { //Si l'extension n'est pas dans le tableau
    $erreur = 'Vous devez uploader un fichier de type .json, .osgjs ou .zip...';
}
if ($taille > $taille_maxi) {
    $erreur = 'Le fichier est trop gros...';
}
if (!isset($erreur)) { //S'il n'y a pas d'erreur, on upload
    //On formate le nom du fichier ici...
    $fichier = strtr($fichier, 'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ', 'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy');
    $fichier = preg_replace('/([^.a-z0-9]+)/i', '-', $fichier);

    if ($extension == '.zip') {
        $zip = new ZipArchive();
        $open = $zip->open($_FILES['osgjsFile']['tmp_name']);
        //die($_FILES['osgjsFile']['tmp_name']);
        if ($open === TRUE) {

            // var_dump($zip);
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $zipFile = $zip->getFromIndex($i);

                $fileStats = $zip->statIndex($i);
                $fileName = strrchr(rtrim($fileStats['name'], '/'), '/');
                $fileExtension = strrchr($fileName, '.');
                switch ($fileExtension) {
                    case '.osgjs':
                    case '.json':
                        $newFile = json_decode($zipFile);
                        $newFile = replaceTexturesPath($newFile);
                        $newFile = json_encode($newFile);
                        $newFile = str_replace("\\", "", $newFile);
                        moveToFolder($newFile, $fileName, $dossierModels);
                        break;
                    case '.jpg':
                    case '.png':
                        moveToFolder($zipFile, $fileName, $dossierTextures);
                        break;
                }

                //echo "fileName : " ;
                //echo "index : $i\n";
                //print_r($zip->statIndex($i));
            }
            //$zip->extractTo("temp/");
            $zip->close();
            header("location: index.html?modelFile=objects%2f" . $fichier);
        } else {
            die('échec' . $open);
        }
    } else {
        // Si le fichier n'est pas un zip
        if (move_uploaded_file($_FILES['osgjsFile']['tmp_name'], $dossierModels . $fichier)) { //Si la fonction renvoie TRUE, c'est que ça a fonctionné...
            echo 'Upload effectué avec succès !';
            header("location: index.html?modelFile=" . $fichier);
        } else { //Sinon (la fonction renvoie FALSE).
            echo 'Echec de l\'upload !';
        }
    }
} else {
    echo $erreur;
}

function replaceTexturesPath($json) {
    findAndChangeTexturesPath($json);
    return $json;
}

function moveToFolder($file, $name, $folder) {
    $handler = fopen($folder . $name, 'w');
    // si le fichier est un modèle on enlève les \ ajoutés par json_encode
//    if(strcmp($folder, "models/") == 0){
//        $file = str_replace("\\", "", $file);
//    }
    fwrite($handler, $file);
    fclose($handler);
}


function findAndChangeTexturesPath($object) {
    $properties = get_object_vars($object);

    foreach ($properties as $key => $property) {
        // si le noeud à parser contient la texture
        if (strcmp($key, "textures") == 0) {
            // on change le chemin pour correspondre à l'emplacement sur le serveur web
            $fileName = strrchr($property[0]->file, '/');
            $newPath = "textures" . $fileName;
            $property[0]->file = $newPath;
        } else {
            // si le noeud à parser contient des enfants ont les parse
            if (strcmp($key, "children") == 0) {
                foreach ($property as $arrayObject) {
                    findAndChangeTexturesPath($arrayObject);
                }
                // on continue de parser uniquement les stateset qui contiennent les textures
            } else if (strcmp($key, "stateset") == 0) {
                findAndChangeTexturesPath($property);
            }
        }
    }
}
?>