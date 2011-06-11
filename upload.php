<?php
error_reporting(E_ALL);
ini_set('display_startp_errors', 1);
ini_set('display_errors', 1);

$dossier = 'models/';
$fichier = basename($_FILES['osgjsFile']['name']);
$taille_maxi = 1000000;
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
        //die($_FILES['osgjsFile']['tmp_name']);
        if ($zip->open($_FILES['osgjsFile']['tmp_name']) === TRUE) {

            $zip->extractTo($dossier);
            $zip->close();
            echo 'ok';
            header("location: index.html?modelFile=" . $fichier);
        } else {
            die('échec');
        }
    } else {
        if (move_uploaded_file($_FILES['osgjsFile']['tmp_name'], $dossier . $fichier)) { //Si la fonction renvoie TRUE, c'est que ça a fonctionné...
            echo 'Upload effectué avec succès !';
            header("location: index.html?modelFile=" . $fichier);
        } else { //Sinon (la fonction renvoie FALSE).
            echo 'Echec de l\'upload !';
        }
    }
} else {
    echo $erreur;
}
?>