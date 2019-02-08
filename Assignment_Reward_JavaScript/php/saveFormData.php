<?php
class UserDetails {
    public function __construct($firstName, $lastName, $email, $primaryCellPhone, $secondaryCellPhone, $permanentAddress, $permanentState, $permanentAddressZipCode, $permanentCountry, $currentAddress, $currentState, $currentAddressZipCode, $currentCountry, $isSubscribed) {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->email = $email;
	$this->password = $password;
        $this->primaryCellPhone = $primaryCellPhone;
        $this->secondaryCellPhone = $secondaryCellPhone;
        $this->permanentAddress = $permanentAddress;
        $this->permanentState = $permanentAddress;
        $this->permanentAddressZipCode = $permanentAddressZipCode;
        $this->permanentCountry = $permanentCountry;
        $this->currentAddress = $currentAddress;
        $this->currentState = $currentState;
        $this->currentAddressZipCode = $currentAddressZipCode;
        $this->currentCountry = $currentCountry;
        $this->isSubscribed = $isSubscribed;
    }
}

$firstName = $_POST['firstName'];  
$lastname = $_POST['lastName'];
$email = $_POST['emailId'] . $_POST['emailDomain'];
$password = $_POST['password']; 
$primaryCellPhone = $_POST['primaryCellPhone'];    
$secondaryCellPhone = $_POST['secondarCellPhone'];    
$permanentState = $_POST['permanentState'];    
$permanentAddress = $_POST['permanentAddress'];    
$permanentCountry = $_POST['currentCountry'];    
$currentCountry = $_POST['permanentCountry'];    
$permanentAddressZipCode = $_POST['permanentZipCode'];    
$currentState = $_POST['currentState'];    
$currentAddress = $_POST['currentAddress'];    
$currentAddressZipCode = $_POST['currentZipCode'];    
$gender = $_POST['gender'];    
$isSubscribed = $_POST['isSubscribed'];

$registeredUser = new UserDetails($firstName, $lastName, $email, $password, $primaryCellPhone, $secondaryCellPhone, $permanentAddress, $permanentState, $permanentAddressZipCode, $permanentCountry, $currentAddress, $currentState, $currentAddressZipCode, $currentCountry, $isSubscribed);

echo(json_encode($registeredUser));

?>
