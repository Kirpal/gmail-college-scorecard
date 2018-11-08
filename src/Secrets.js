/** 
 * Gets secrets stored in script properties
 *
 * @param {string} key - Which secret to get (mapquest/collegeApi)
 * @return {string}
 */
function Secrets(key) {
    var props = PropertiesService.getScriptProperties();

    return props.getProperty(key);
}