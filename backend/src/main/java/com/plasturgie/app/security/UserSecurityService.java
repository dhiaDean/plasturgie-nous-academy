package com.plasturgie.app.security; // Or your preferred package for security utility services

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
// No need to import User model or UserService if UserPrincipal has the ID

@Service("userSecurity") // This makes the bean available with the name "userSecurity" in SpEL
public class UserSecurityService {

    private static final Logger logger = LoggerFactory.getLogger(UserSecurityService.class);

    /**
     * Checks if the ID from the path variable matches the ID of the currently authenticated user.
     *
     * @param pathId The ID from the URL path (e.g., /api/users/{id} -> this is #id).
     * @param currentUser The UserPrincipal object for the currently authenticated user (this is #currentUser or principal).
     * @return true if the IDs match, false otherwise.
     */
    public boolean isCurrentUser(Long pathId, UserPrincipal currentUser) {
        if (currentUser == null || currentUser.getId() == null || pathId == null) {
            logger.warn("isCurrentUser check: Received null for pathId or currentUser/currentUser.id. PathId: {}, CurrentUser: {}", pathId, currentUser);
            return false;
        }
        boolean isMatch = currentUser.getId().equals(pathId);
        logger.debug("isCurrentUser check - Path ID: {}, Current User ID: {}. Match: {}", pathId, currentUser.getId(), isMatch);
        return isMatch;
    }

    // You can add other custom security methods here later if needed, for example:
    // public boolean isInstructorForCourse(Long courseId, UserPrincipal currentUser) {
    //    // Logic to check if the currentUser (who must be an instructor) is assigned to the courseId
    //    // This would likely involve fetching Course and Instructor entities via services.
    //    return false; // Placeholder
    // }
}