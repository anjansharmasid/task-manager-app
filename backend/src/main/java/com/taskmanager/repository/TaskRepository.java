package com.taskmanager.repository;

import com.taskmanager.model.TaskTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<TaskTest, UUID> {
}