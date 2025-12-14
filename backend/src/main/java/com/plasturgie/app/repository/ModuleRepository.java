package com.plasturgie.app.repository;

import com.plasturgie.app.model.Module;
import org.springframework.data.jpa.repository.EntityGraph; // Import this
import org.springframework.data.jpa.repository.JpaRepository;
// Query and Param not strictly needed for this specific derived query method
// but good to have if you add custom @Query methods.
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
// import java.util.Optional; // If you keep the example custom query

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {

    @EntityGraph(attributePaths = {"course"}) // Eagerly fetch the 'course' association
    List<Module> findByCourseCourseIdOrderByModuleOrderAsc(Long courseId);

    // Optional: Example of a custom query
    // @Query("SELECT m FROM Module m JOIN FETCH m.course c WHERE c.courseId = :courseId AND m.title = :title")
    // Optional<Module> findByCourseAndTitle(@Param("courseId") Long courseId, @Param("title") String title);
}