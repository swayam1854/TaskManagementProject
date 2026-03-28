package com.taskmanagement.backend.repository;

import com.taskmanagement.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(String status);

    List<Task> findByAssignedToId(Long userId);

    List<Task> findByStatusAndAssignedToId(String status, Long userId);
}