const messages = require("./messages");

function validatePatternsUser(requestObject) {
  let rejects = [];
  let { first_name, last_name, email, user_password } = requestObject;

  const reg = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

  if (first_name && first_name.trim().length < 3)
    rejects.push(messages.firstNameMinLen);
  if (last_name && last_name.trim().length < 3)
    rejects.push(messages.lastNameMinLen);
  if (user_password && user_password.trim().length < 8)
    rejects.push(messages.passwordMinLen);

  if (first_name && first_name.trim().length > 20)
    rejects.push(messages.firstNameMaxLen);
  if (last_name && last_name.trim().length > 30)
    rejects.push(messages.lastNameMaxLen);
  if (user_password && user_password.trim().length > 20)
    rejects.push(messages.passwordMaxLen);

  if (email && !reg.test(email)) rejects.push(messages.emailInvalid);

  return rejects;
}

function validatePatternsAddress(requestObject) {
  let rejects = [];
  let { zipcode, street, district, city, state, country } = requestObject;

  if (street && street.trim().length < 5) rejects.push(messages.streetMinLen);
  if (district && district.trim().length < 5)
    rejects.push(messages.districtMinLen);
  if (city && city.trim().length < 3) rejects.push(messages.cityMinLen);
  if (country && country.trim().length < 3)
    rejects.push(messages.countryMinLen);

  if (street && street.trim().length > 100) rejects.push(messages.streetMaxLen);
  if (district && district.trim().length > 50)
    rejects.push(messages.districtMaxLen);
  if (city && city.trim().length > 50) rejects.push(messages.cityMaxLen);
  if (country && country.trim().length > 20)
    rejects.push(messages.countryMaxLen);

  if (zipcode && zipcode.trim().length !== 8) rejects.push(messages.zipcodeLen);
  if (state && state.trim().length !== 2) rejects.push(messages.stateLen);

  return rejects;
}

function validatePatternsAddressUser(requestObject) {
  let rejects = [];
  let {
    zipcode,
    street,
    district,
    city,
    state,
    country,
    address_number,
    complement,
  } = requestObject;

  if (street && street.trim().length < 5) rejects.push(messages.streetMinLen);
  if (district && district.trim().length < 5)
    rejects.push(messages.districtMinLen);
  if (city && city.trim().length < 3) rejects.push(messages.cityMinLen);
  if (country && country.trim().length < 3)
    rejects.push(messages.countryMinLen);
  if (complement && complement.trim().length < 5)
    rejects.push(messages.complementMinLen);

  if (street && street.trim().length > 100) rejects.push(messages.streetMaxLen);
  if (district && district.trim().length > 50)
    rejects.push(messages.districtMaxLen);
  if (city && city.trim().length > 50) rejects.push(messages.cityMaxLen);
  if (country && country.trim().length > 20)
    rejects.push(messages.countryMaxLen);
  if (complement && complement.trim().length > 100)
    rejects.push(messages.complementMaxLen);

  if (zipcode && zipcode.trim().length !== 8) rejects.push(messages.zipcodeLen);
  if (state && state.trim().length !== 2) rejects.push(messages.stateLen);
  if (address_number && isNaN(address_number) && address_number !== "N/A")
    rejects.push(messages.addressNumberInvalidNA);
  if (
    address_number &&
    !isNaN(address_number) &&
    !Number.isInteger(address_number) &&
    Number(address_number) <= 0 &&
    Number(address_number) > 999999
  )
    rejects.push(messages.limitOfAddressNumber);

  return rejects;
}

module.exports = {
  validatePatternsUser,
  validatePatternsAddress,
  validatePatternsAddressUser,
};
